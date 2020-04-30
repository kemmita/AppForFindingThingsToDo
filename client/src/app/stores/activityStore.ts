import {action, computed, observable, reaction, runInAction, toJS} from "mobx";
import {IActivity} from "../Interfaces/activity";
import agent from "../api/agent";
import {history} from '../..'
import {toast} from "react-toastify";
import {RootStore} from "./rootStore";
import {IUser} from "../Interfaces/user";
import {IAttendee} from "../Interfaces/attendee";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

const LIMIT = 3;

export default class ActivityStore{
    rootStore: RootStore;

    constructor(rootStore: RootStore){
        this.rootStore = rootStore;

        reaction(
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial: boolean = false;
    @observable.ref hubConnection: HubConnection | null = null;
    @observable activityCount = 0;
    @observable page = 0;
    @observable predicate = new Map();

    @action setPredicate =(predicate: string, value: string | Date) =>{
        this.predicate.clear();
        if (predicate !== 'all') {
            this.predicate.set(predicate, value)
        }
    };

    @computed get axiosParams() {
        const params = new URLSearchParams();
        params.append('limit', LIMIT.toString());
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value, key) =>{
           if (key === 'startDate'){
               params.append(key, value.toISOString());
           }  else  {
                params.append(key, value);
           }
        });
        return params;
    };

    @action loadActivities = async () =>{
        this.loadingInitial = true;
        try {
            const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
            runInAction('loading activities',() =>{
                activitiesEnvelope.activities.forEach(activity =>{
                    this.setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.activityCount = activitiesEnvelope.activityCount;
                this.loadingInitial = false;
            });
        } catch (e) {
            runInAction('loading activities failed',() =>{
                this.loadingInitial = false;
            });
            console.log(e);
        }
    };

    @computed get totalPages() {
        return Math.ceil(this.activityCount / LIMIT);
    }

    @action setPage = (page: number) => {
        this.page = page;
    };

    @action createHubConnection = (activityId: string) =>{
        this.hubConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44396/chat', {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() =>{
                this.hubConnection!.invoke('AddToGroup', activityId)
            })
            .catch(e => console.log('Error establishing signal r connection', e));

        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() =>{
                this.activity!.comments.push(comment);
            });
        });

        this.hubConnection.on('Send', message =>{
            // toast.info(message);
        });
    };

    @action stopHubConnection = (activityId: string) =>{
        console.log(2);
        this.hubConnection!.invoke('RemoveFromGroup', activityId)
            .then(() =>{
                this.hubConnection!.stop();
            })
            .then(() => console.log('Connection Stopped'))
            .catch(() => console.log('Error stopping hub connection'));
    };

    @action addComment = async (values: any) =>{
        values.activityId = this.activity!.id;
        try {
            await this.hubConnection!.invoke('SendComment', values)
        } catch (e) {
            console.log(e);
        }
    };

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
    };

    groupActivitiesByDate = (activities: IActivity[]) =>{
        const sortedByDate = activities.sort(
            (a,b) => a.date.getTime() + b.date.getTime()
        );
        return Object.entries(sortedByDate.reduce((activities, activity) =>{
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as {[key: string]: IActivity[]}));
    };

    @action loadActivity = async (id: string) =>{
      let activity = this.getActivity(id);
      if(activity){
          this.activity = activity;
          return toJS(activity);
      }else {
          try {
              activity = await agent.Activities.details(id);
              runInAction('load single activity',() =>{
                  this.setActivityProps(activity, this.rootStore.userStore.user!);
                  this.activity = activity;
                  this.activityRegistry.set(activity.id, activity);
              });
              return activity;
          }catch (e) {
              runInAction('load activity error', () =>{
              });
              console.log(e)
          }
      }
    };

    @action editActivity = async (activity: IActivity) =>{
        try {
            await agent.Activities.update(activity);
            runInAction('edit activity',() =>{
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                history.push(`/activity/${activity.id}`)
            });
        }
         catch (e) {
        toast.error(e.toString());
        }
    };

    @action createActivity = async (activity: IActivity) =>{
        try {
            await agent.Activities.create(activity);
            runInAction('create activity',() =>{
                let user: IUser = this.getCurrentUser();
                let attendee: IAttendee = this.convertInitialUserToAttendee(user);
                activity.attendees = [];
                activity.comments = [];
                activity.attendees.push(attendee);
                activity.isHost = true;
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                history.push(`/activity/${activity.id}`);
            });
        } catch (e) {
            toast.error(e.toString());
        }
    };

    @action deleteActivity = (id: string) =>{
        console.log(1);
        agent.Activities.delete(id).then(() =>{
            runInAction('delete activity',() =>{
                this.activityRegistry.delete(id);
                this.activity = null;
                history.push('/activities');
            });
        });
    };

    @action attendActivity = async (id: string) =>{
        let user = this.getCurrentUser();
        const attendee : IAttendee = this.convertInitialUserToAttendee(user);
        try {
            await agent.Activities.attend(id);
            runInAction('attend activity', () =>{
                if (this.activity){
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
            });
        } catch (e) {
            toast.error(e.toString());
        }
    };

    @action cancelAttendance = async (id: string) =>{
        try {
            await agent.Activities.cancelAttendance(id);
            runInAction('cancel attend activity', () =>{
                if (this.activity){
                    for( let i = 0; i < this.activity.attendees.length; i++){
                        if ( this.activity.attendees[i].username === this.rootStore.userStore.user!.username) {
                            this.activity.attendees.splice(i, 1);
                            i--;
                        }
                    }
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
            });
        } catch (e) {
            toast.error(e.toString());
        }
    };

    setActivityProps = (activity: IActivity, user: IUser) : void =>{
        activity.date = new Date(activity.date);
        activity.isGoing = activity.attendees.some(
            a => a.username === user.username
        );
        activity.isHost = activity.attendees.some(
            a => a.username === user.username && a.isHost
        );
    };

    getActivity = (id: string) : IActivity =>{
        return this.activityRegistry.get(id);
    };

    getCurrentUser = () : IUser =>{
        return this.rootStore.userStore.user!;
    };

    convertInitialUserToAttendee = (user: IUser) : IAttendee =>{
        return {
            displayName: user.username,
            image: undefined,
            isHost: true,
            username: user.username,
            following: false
        };
    }

}

