using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly ApplicationDbContext _db;
            private readonly IMapper _mapper;
            public Handler(ApplicationDbContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }
            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {

                var activity = await _db.Activities.FindAsync(request.ActivityId);

                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Not found!" });
                }

                var user = await _db.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                _db.Comments.Add(comment);

                var success = await _db.SaveChangesAsync() > 0;

                if (success)
                {
                    return _mapper.Map<CommentDto>(comment);
                }

                throw new Exception("Problem saving new activity");
            }
        }
    }
}
