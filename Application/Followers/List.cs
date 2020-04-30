

using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<Profile>> 
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {

            private readonly ApplicationDbContext _db;
            private readonly IProfileReader _profileReader;
            public Handler(ApplicationDbContext db, IProfileReader profileReader)
            {
                _db = db;
                _profileReader = profileReader;
            }

            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userFollwings = new List<UserFollowing>();

                var profiles = new List<Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        userFollwings = await _db.Followings.Where(x => 
                            x.Target.UserName == request.Username).ToListAsync();
                        foreach (var follower in userFollwings)
                            profiles.Add(await _profileReader.ReadProfile(follower.Observer.UserName));
                        break;
                    case "following":
                        userFollwings = await _db.Followings.Where(x =>
                            x.Observer.UserName == request.Username).ToListAsync();
                        foreach (var follower in userFollwings)
                            profiles.Add(await _profileReader.ReadProfile(follower.Target.UserName));
                        break;
                    default:
                        break;
                }

                return profiles;
            }
        }
    }
}
