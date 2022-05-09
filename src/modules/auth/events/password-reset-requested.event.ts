type Payload = {
  email: string;
  userName: string;
  resetPasswordUrl: string;
};

export class PasswordResetRequestedEvent {
  constructor(public readonly payload: Payload, public readonly lang: string) {}
}
