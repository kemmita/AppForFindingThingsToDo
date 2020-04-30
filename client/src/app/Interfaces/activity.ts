import {runInAction} from "mobx";
import {IAttendee} from "./attendee";

export interface IActivitiesEnvelope {
    activities: IActivity[],
    activityCount: number
}

export interface IActivity {
    id: string,
    title: string,
    description: string,
    category: string,
    date: Date,
    city: string,
    venue: string,
    isGoing: boolean,
    isHost: boolean,
    attendees: IAttendee[],
    comments: IComment[]
}

export interface IComment {
    id: string,
    createdAt: Date,
    body: string,
    username: string,
    displayName: string,
    image: string
}

export interface IActivityFormValues extends Partial<IActivity> {
    time?: Date
}

export class ActivityFormValues implements IActivityFormValues{
    id?: string = undefined;
    title: string = '';
    description: string = '';
    category: string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';
    constructor(init?: IActivityFormValues){
        runInAction(() =>{
            if (init){
                init.time = init.date;
            }
            Object.assign(this, init);
            console.log(this)
        });
    }
}
