#Jira Issue Context Bug Tracker 

This project contains a Forge app written in Javascript that displays a dynamic table of related bug tickets in a Jira issue context panel. It displays a `Create Bug Ticket` button that will open a modal for users to type in a summary. After submitting, it will open the newly created ticket in a new tab and display the ticket in the table.

This project is an updated version of the `Jira Bug Tracker`. This replaces the jira issue panel since users would have to click on `Apps' each time to display this app. By using an Issue Context, this will always be displayed on the right panel of an issue. Users can click the dropdown once to keep this app open on all tickets. 

The primary goal of this app is to streamline bug tracking while preventing clutter on the main project board. Previously, the quality analysis team documented fixes by leaving comments on existing tickets. By creating dedicated bug tickets instead, the team can more accurately represent workload. Additionally, Jira automation does not support rich text editor for the description fields to create automated tickets. This app simplifies the process by opening a modal for users to create a ticket. Users simply type in a new ticket summary and it will automatically open the created ticket in a new tab. This is a limitation of using Jira automations and has been solved with this custom Forge app. 




See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app frontend by editing the `src/frontend/index.jsx` file.

- Modify your app backend by editing the `src/resolvers/index.js` file to define resolver functions. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
