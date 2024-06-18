#include <security/pam_modules.h>
#include <security/pam_ext.h>
#include <security/pam_appl.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include <syslog.h>
#include "env.h"

// Authentication function
extern int pam_sm_authenticate(pam_handle_t *pamh, int flags, int argc, const char **argv) {
    const char *user;
    // const char *password;
    int status;
    pid_t pid;

    
    // Get the username
    if (pam_get_user(pamh, &user, NULL) != PAM_SUCCESS) {
        return PAM_AUTH_ERR;
    }

    // Log the username to the console
    pam_syslog(pamh, LOG_INFO, "User %s", user);

    // Fork a new process
    pid = fork();
    if (pid == -1) {
        // Fork failed
        pam_syslog(pamh, LOG_ERR, "Fork failed");
        return PAM_AUTH_ERR;
    } else if (pid == 0) {
        // Child process
        // Execute the external binary
        execl(AUTH_BINARY, AUTH_BINARY, user, DISCORD_TOKEN, DISCORD_APPROVER_USER_ID, (char *)NULL);
        // If exec fails
        _exit(PAM_AUTH_ERR);
    } else {
        // Parent process
        // Wait for the child process to finish
        if (waitpid(pid, &status, 0) == -1) {
            pam_syslog(pamh, LOG_ERR, "waitpid failed");
            return PAM_AUTH_ERR;
        }

        // Check the exit status of the child process
        if (WIFEXITED(status) && WEXITSTATUS(status) == 0) {
            // Authentication success
            return PAM_SUCCESS;
        } else {
            // Authentication failure
            return PAM_AUTH_ERR;
        }
    }
}

extern int pam_sm_setcred(pam_handle_t *pamh, int flags, int argc, const char **argv) {
    return PAM_SUCCESS;
}
