using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Profiles;
using Application.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IMediator _mediator;
        public UserController(IMediator mediator, IPhotoAccessor photoAccessor)
        {
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
           return await _mediator.Send(new Login.Query {Email = query.Email, Password = query.Password});
        }

        [AllowAnonymous]
        [HttpPost("External/login")]
        public async Task<ActionResult<User>> ExternalLogin(ExternalLogin.Query query)
        {
            return await _mediator.Send(query);
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        [HttpGet("Profile/{username}")]
        public async Task<ActionResult<Profile>> GetProfileDetails(string username)
        {
            return await Mediator.Send(new Details.Query { Username = username});
        }


        [HttpGet("Activities/{username}")]
        public async Task<ActionResult<List<UserActivityDto>>> GetProfileActivities(string username, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate });
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> UpdateProfile(UpdateProfile.Command command)
        {
            return await _mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpGet("confirmEmail")]
        public async Task<ActionResult<Unit>> ConfirmEmail([FromQuery]ConfirmEmail.Command command)
        {
            await _mediator.Send(command);

            return Redirect("http://localhost:3000");
        }
    }
}