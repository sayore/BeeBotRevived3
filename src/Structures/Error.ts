export enum ChannelErrorMessage {
  ChannelToNotExist = "Channel to redirect to does not exist",
  ChannelFromNotExist = "Source channel does not exist",
  SameChannels = "Channel 'from' and 'to' cannot be the same",
  ChannelReceiving = "Channel is already receiving",
  ChannelRedirected = "Channel is already redirected to another channel",
  NotAValidChannel = "Channel is not a valid channel",
  ChannelNotRedirected = "Channel is not redirected"
}

export interface IError {
  code: number;
  cause: string;
}

export class RedirectError extends Error implements IError  {
  constructor(public code: number, public cause: ChannelErrorMessage, public extra?: any) {
    super();
    this.name = "RedirectError: " + cause;
    //this.stack="";
  }

}
