
import "@/styles/index.scss";

import { LoginPage } from "@/views/pages/login/login";
import { RegistrationPage } from "@/views/pages/registration/registration";
import { MessengerPage } from "@/views/pages/messenger/messenger";
import { Error404Page } from "@/views/pages/error404/error404";
import { Error505Page } from "@/views/pages/error505/error505";
import { ProfilePage } from "@/views/pages/profile/profile";
import { ProfileSettingsForm } from "@/views/pages/profile-settings-form/profile-settings-form";
import { ChangePasswordForm } from "@/views/pages/change-password-form/change-password-form";

function mountPage<T>(
  selector: string,
  PageCtor: new (props?: T) => { getContent: () => HTMLElement },
  props?: T
) {
  const root = document.querySelector<HTMLElement>(selector);
  if (!root) return;

  const page = new PageCtor(props);
  root.appendChild(page.getContent());
}

mountPage("#app", LoginPage);

mountPage("#appRegistration", RegistrationPage);

mountPage("#appMessenger", MessengerPage);

mountPage("#appErorr404", Error404Page);

mountPage("#appErorr505", Error505Page);

mountPage("#appProfilePage", ProfilePage);

mountPage("#profileSettingsForm", ProfileSettingsForm);

mountPage("#changePasswordForm", ChangePasswordForm);

