# JAM

Log in to Linux via Discord (cursed)

> [!CAUTION]
> Do not actually use this for anything important. This is not intended to be a secure way to log in.

## Installation

For Debian and its derivatives, you will need to install `libpam0g-dev` to compile the PAM module.

You will also need to have [Bun](https://bun.sh) installed to be able to compile the discord authentication binary. After it's installed, run `bun install` to install the dependencies.

## Setup

1. Create a new application on the [Discord Developer Portal](https://discord.com/developers/applications).
2. Go to the "Bot" tab, create a bot for the application, and copy its token.
3. In the file "env.h" paste the Discord bot token inside the parentheses in the line containing "DISCORD_TOKEN".
4. Go to the "Installation" tab and change the authorization method from "Guild Install" to "User Install". Then, set the install link to "Discord Provided Link" and open the link in your browser to authorize the bot.
5. In your Discord app, go to Advanced settings and turn on developer mode. Then, exit settings, click your name in the bottom left, then click "Copy User ID".
6. In the file "env.h", paste the user id  inside the parenthese in the line containing "DISCORD_APPROVER_USER_ID".
7. Go to /etc/pam.d/ and edit the file "login" with administrative privileges. You may want to make a copy of the file before you do this as a backup. At the bottom of the file, add the line `auth required pam_jam.so`. This will make the PAM module required for login.
8. Confirm that the file "pam_deny.so" is in the directory '/lib/x86_64-linux-gnu/security/'. If it is somewhere else, you will need to change the paths in build.sh and env.h to the correct location.
9. Run `build.sh` to compile and copy the binaries to the correct location.
10. Try logging in. You should receive a DM from the Discord bot that will allow you to approve or decline the login request.