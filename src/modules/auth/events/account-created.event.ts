type Payload = {
  email: string;
  userName: string;
  confirmationUrl: string;
};

export class AccountCreatedEvent {
  constructor(public readonly payload: Payload, public readonly lang: string) {}
}
