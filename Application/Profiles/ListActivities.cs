using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<List<UserActivityDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        //we then create a class Handler that will take in a query that was defined above and return a type of List<Activity> 
        public class Handler : IRequestHandler<Query, List<UserActivityDto>>
        {
            //below we inject our db context
            private readonly ApplicationDbContext _db;
            private readonly IMapper _mapper;
            public Handler(ApplicationDbContext db, IMapper mapper)
            {
                _db = db;
                _mapper = mapper;
            }
            //We then finally execute our task Handle. Fetching an entire list of elements with no arguments will allow us to ignore
            //the params for now. We simply fetch the data from the db.
            public async Task<List<UserActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _db.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { user = "Not Found" });

                var queryable = user.UserActivities
                    .OrderBy(a => a.Activity.Date)
                    .AsQueryable();

                switch(request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(x => x.Activity.Date <= DateTime.Now);
                        break;
                    case "hosting":
                        queryable = queryable.Where(x => x.IsHost && x.Activity.Date >= DateTime.Now);
                        break;
                    default:
                        queryable = queryable.Where(x => x.Activity.Date >= DateTime.Now);
                            break;

                }

                return _mapper.Map<List<UserActivity>, List<UserActivityDto>>(queryable.ToList());
            }
        }
    }
}
