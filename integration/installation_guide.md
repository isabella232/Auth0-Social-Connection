The Hugging Face social connection allows users to log in to your application using their Hugging Face profile.

It's also possible to interact with the Hugging Face API using the access token provided by the connection. This allows you to read and write data to the user's Hugging Face account, including their models, datasets, and Spaces.

## Prerequisites

1. An Auth0 account and tenant. [Sign up for free](https://auth0.com/signup).
1. Create a Hugging Face account. [Sign up for free](https://huggingface.co/join).

## Set up Hugging Face

1. Create an application at https://huggingface.co/settings/applications/new
1. Make sure to tick the scopes you need, for example `profile` and `email`.
1. Set the redirect URL to `https://YOUR_DOMAIN/login/callback`
1. Make a note of the `Client ID` and `Client Secret`.

## Add the Connection

1. Select **Add Integration** (at the top of this page).
1. Read the necessary access requirements, and select **Continue**.
1. Configure the integration using the following fields:
   * Client ID
   * Client Secret
1. Select the **Permissions** needed for your applications.
1. Choose and configure whether to sync user profile attributes at each login.
1. Select **Create**.
1. In the **Applications** view, choose the Applications that should use this Connection to log in.

## Test connection

You're ready to [test this Connection](https://auth0.com/docs/authenticate/identity-providers/test-connections).

## Troubleshooting

Send an email to website@huggingface.co if you encounter issues.
