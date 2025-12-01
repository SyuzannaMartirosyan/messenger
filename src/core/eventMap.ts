export interface EventMap {
  "auth:login": {
     login: string;
     password: string 
    };
  "auth:success": { 
    user: unknown 
  }; 
    "auth:registration": {
    email: string;
    login: string;
    first_name: string;
    second_name: string;
    phone: string;
    password: string;
    confirm_password: string;
  };
  "chat:selected": {
    id: number;
    name: string;
    avatar?: string;
  };
 "message:send": {
  text: string;
  time: string;
};
"profile:updated": Partial<{
    avatarSrc: string;
    firstName: string;
    lastName: string;
    fields: {
      label: string;
      type?: string;
      name?: string;
      value?: string;
      isEditable?: boolean;
    }[];
  }>;
 "messages:updated": {
    chatId: number;
    messages: unknown[];
  };
  "form:submit": { 
    formName: string; 
    values: Record<string, unknown> 
  };
}
