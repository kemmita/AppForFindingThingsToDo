using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        [HttpGet("")]
        public async Task<ActionResult<ActivitiesList.ActivitiesEnvelope>> GetListOfAllActivities(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
        {
            return await Mediator.Send(new ActivitiesList.Query{Limit = limit, Offset = offset, IsGoing = isGoing, IsHost = isHost, StartDate = startDate});
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetActivityDetails(Guid id)
        {
            return await Mediator.Send(new ActivityDetail.Query{Id = id});
        }

        [HttpPost("")]
        public async Task<ActionResult<Unit>> Create(CreateActivity.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Update(Guid id, EditActivity.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> JoinActivity(Guid id)
        {
            return await Mediator.Send(new JoinActivity.Command { Id = id });
        }

        [HttpDelete("{id}/removeAttendance")]
        public async Task<ActionResult<Unit>> RemoveAttendance(Guid id)
        {
            return await Mediator.Send(new RemoveAttendance.Command { Id = id });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new DeleteActivity.Command{Id = id});
        }
    }
}