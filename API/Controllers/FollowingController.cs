using Application.Followers;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class FollowingController : BaseController
    {

        [HttpPost("{username}")]
        public async Task<ActionResult<Unit>> PostFollowing(string username, Add.Command command)
        {
            command.Username = username;
            return await Mediator.Send(command);
        }

        [HttpDelete("delete/{username}")]
        public async Task<ActionResult<Unit>> DeleteFollowing(string username)
        {
            return await Mediator.Send(new Delete.Command { Username = username});
        }

        [HttpGet("data/{username}/{predicate}")]
        public async Task<ActionResult<List<Profile>>> Data(string username, string predicate)
        {
            return await Mediator.Send(new List.Query { Predicate = predicate, Username = username });
        }
    }
}