using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly ApplicationDbContext _db;
        private readonly IUserAccessor _userAccessor; 
        public ProfileReader(ApplicationDbContext db, IUserAccessor userAccessor)
        {
            _db = db;
            _userAccessor = userAccessor;
        }
        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _db.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new { user = "not found" });

            var currentUser = await _db.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                Photos = user.Photos,
                Bio = user.Bio ?? "Bio",
                DisplayName = user.DisplayName,
                Image = user.Photos.FirstOrDefault(p => p.IsMainPhoto)?.Url,
                Username = user.UserName,
                FollowersCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count()
            };

            // chech to see if the current logged in user is following the user
            if (user.Followers.Any(x => x.ObserverId == currentUser.Id))
                profile.IsFollowing = true;

            return profile;
        }
    }
}
