using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ActivitiesList
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }

        //below we define our query, our query should return a list of activities.
        public class Query : IRequest<ActivitiesEnvelope> 
        {
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public DateTime? StartDate { get; set; }
        }

        //we then create a class Handler that will take in a query that was defined above and return a type of List<Activity> 
        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            //below we inject our db context
            private readonly ApplicationDbContext _db;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccesor;
            public Handler(ApplicationDbContext db, IMapper mapper, IUserAccessor userAccesor)
            {
                _db = db;
                _mapper = mapper;
                _userAccesor = userAccesor;
            }
            //We then finally execute our task Handle. Fetching an entire list of elements with no arguments will allow us to ignore
            //the params for now. We simply fetch the data from the db.
            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var startDate = request.StartDate == null ? request.StartDate = DateTime.Now : request.StartDate;

                var queryable = _db.Activities
                    .Where(x => x.Date >= startDate)
                    .OrderBy(x => x.Date)
                    .AsQueryable();

                if (request.IsGoing && !request.IsHost)
                    queryable = queryable.Where(x => x.UserActivities.Any(a =>
                    a.AppUser.UserName == _userAccesor.GetCurrentUsername() && !a.IsHost));

                if (request.IsHost && !request.IsGoing)
                    queryable = queryable.Where(x => x.UserActivities.Any(a =>
                    a.AppUser.UserName == _userAccesor.GetCurrentUsername() && a.IsHost));


                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3)
                    .ToListAsync();

                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}
