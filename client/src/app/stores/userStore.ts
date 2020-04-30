import {action, computed, observable, reaction, runInAction} from "mobx";
import {IUser, IUserFormValues} from "../Interfaces/user";
import agent from "../api/agent";
import {RootStore} from "./rootStore";
import { history } from '../..';
import {IPhoto, IProfile} from "../Interfaces/profile";
import {toast} from "react-toastify";
import {IUserActivity} from "../Interfaces/userActivity";

export default class UserStore
{
    rootStore: RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3  || activeTab === 4){
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.getFollowDate(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    @observable user: null | IUser = null;

    @observable profile: null | IProfile = null;

    @observable loadingProfile: boolean = true;

    @observable uploadingPhoto: boolean = false;

    @observable deletingPhoto: boolean = false;

    @observable loading: boolean = false;

    @observable followings: IProfile[] = [];

    @observable activeTab: number = 0;

    @observable currentUserProfileData: IProfile | null = null;

    @observable userActivities: IUserActivity[] = [];

    @computed get isLoggedIn() {return !!this.user};

    @computed get isCurrentUser() {
        if (this.user && this.profile){
            return this.user.username === this.profile.username;
        } else{
            return false;
        }
    };

    @action loadUserActivities = async (username: string, predicate?: string) =>{
        this.loading = true;
        try {
            const activities = await agent.User.listProfileActivities(username, predicate!);
            runInAction(() =>{
                this.userActivities = activities;
                this.loading = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(() =>{
                this.loading = false;
            })
        }
    };

    @action setActiveTab = (activeIndex: number) =>{
      this.activeTab = activeIndex;
    };

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction('Return user after successful login', () =>{
                this.user = user;
                this.rootStore.commonStore.setToken(user.token);
                this.rootStore.modalStore.closeModal();
                history.push('/activities');
            });
        } catch (e) {
            runInAction('Error with user login', () =>{
                throw e;
            });
        }
    };

    @action register = async (values: IUserFormValues) =>{
        try {
            const user = await agent.User.register(values);
            runInAction('Register user success', () =>{
                this.user = user;
                this.rootStore.commonStore.setToken(user.token);
                this.rootStore.modalStore.closeModal();
                history.push('/activities');
            });
        }catch (e) {
            runInAction('Error with user Registration', () =>{
                throw e;
            });
        }
    };

    @action logout = () =>{
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    };

    @action getCurrentUser = async () =>{
        try {
            const user = await agent.User.current();
            runInAction('Current user returned', () =>{
               this.user = user;
            });
        } catch (e) {
            runInAction('Error fetching current user', () =>{
               console.log(e);
            });
        }
    };

    @action getUserProfileData = async (userName: string) =>{
        this.loadingProfile = true;
        try {
            let profileToFetch = await agent.User.getProfileData(userName);
            runInAction('Profile Returned', () =>{
                this.profile = profileToFetch;
                this.loadingProfile = false;
            });
        } catch (e) {
            runInAction('Error fetching Profile data', () =>{
                console.log(e);
                this.loadingProfile = false;
            });
        }
    };

    @action updateUserProfileData = async (profile: IProfile) =>{
      try {
          await agent.User.updateProfileData(profile);
          runInAction(() =>{
             if (this.profile && this.user){
                 this.profile.displayName = profile.displayName;
                 this.profile.bio = profile.bio;
                 this.user.displayName = profile.displayName;
             }
          });
      } catch (e) {
          console.log(e);
      }
    };

    @action getCurrentUserProfileData = async (username: string) =>{
        try {
            const currentUserProfile = await agent.User.getProfileData(username);
            runInAction(() =>{
                this.currentUserProfileData = currentUserProfile;
            });
        } catch (e) {
            console.log(e);
        }
    };

    @action uploadPhoto = async (photo: Blob) =>{
      this.uploadingPhoto = true;
      try {
        let photoAdded = await agent.User.uploadPhoto(photo);
        runInAction(() =>{
            if (this.profile){
                this.profile.photos.push(photoAdded);
                if (photoAdded.isMain && this.user){
                    this.user.image = photoAdded.url;
                    this.profile.image = photoAdded.url;
                }
            }
            this.uploadingPhoto = false;
        })
      } catch (e) {
          console.log(e);
          toast.error('Problem uploading photo');
          runInAction(() =>{
              this.uploadingPhoto = false;
          });
      }
    };

    @action setMainPhoto = async (photo: IPhoto) =>{
      try {
          await agent.User.setMainPhoto(photo.id);
          runInAction(() =>{
              if (this.profile && this.user){
                  this.user.image = photo.url;
                  this.profile.image = photo.url;
              }
          });
      } catch (e) {
          console.log(e);
          toast.error('Problem setting main photo');
      }
    };

    @action deletePhoto = async (photo: IPhoto) =>{
        this.deletingPhoto = true;
        try {
          await agent.User.deletePhoto(photo.id);
          runInAction(() =>{
             if (this.profile){
                 this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
             }
             this.deletingPhoto = false;
          });
        } catch (e) {
          console.log(e);
          toast.error('Problem deleting photo');
          runInAction(() =>{
              this.deletingPhoto = false;
          });
        }
    };

    @action follow = async (username: string) =>{
        this.loading = true;
        try {
            await agent.User.follow(username);
            runInAction(() =>{
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.followings.push(this.currentUserProfileData!);
                this.loading = false;
            })
        } catch (e) {
            toast.error('Problem following user');
            runInAction(() =>{
                this.loading = false;
            })
        }
    };

    @action unfollow = async (username: string) =>{
        console.log('sss');
        this.loading = true;
        try {
            await agent.User.unfollow(username);
            runInAction(() =>{
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.followings = this.followings.filter(x => x.username === username);
                this.loading = false;
            })
        } catch (e) {
            console.log(e);
            toast.error('Problem unfollowing user');
            runInAction(() =>{
                this.loading = false;
            })
        }
    };

    @action getFollowDate = async (predicate: string) =>{
        this.loading = true;
        try {
            const profiles = await agent.User.getFollowData(this.profile!.username, predicate);
            runInAction(()=>{
               this.followings = profiles;
               this.loading = false;
            });
        } catch (e) {
            toast.error('Problem loading followings');
            runInAction(() =>{
               this.loading = false;
            });
        }
    };
}

