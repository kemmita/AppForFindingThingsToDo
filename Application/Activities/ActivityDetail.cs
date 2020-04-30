using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ActivityDetail
    {
        //specify what param is expected to be passed for this Query
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly ApplicationDbContext _db;
            private readonly IMapper _mapper;

            public Handler(ApplicationDbContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }
            //using Query defined above wih a param Id of type Guid, we will locate a single activity in the db associated with the Guid id.
            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _db.Activities.FindAsync(request.Id);

                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Activity Not Found" });
                }

                var toReturn = _mapper.Map<Activity, ActivityDto>(activity);
                return toReturn;
            }
        }
    }
}
