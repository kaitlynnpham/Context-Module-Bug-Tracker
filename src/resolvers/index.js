import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { requestJira } from '@forge/bridge';

const resolver = new Resolver();

resolver.define('fetchIssueKey', async (req) => {
  const key = req.context.extension.issue.key;
  const customFieldId = '"Related Ticket"';

  if (!key) {
    console.warn('Issue key not found');
    return [];
  }
  const jql = `${customFieldId} = "${key}"`;
  console.log("Generated JQL:", jql);

  const res = await api.asApp().requestJira(
    route`/rest/api/3/search`,
    {
      method: 'POST',
      body: JSON.stringify({
        jql: jql,
        fields: ['summary', 'key', 'updated', 'status', 'assignee']
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await res.json();
  return {
    body: data.issues || [],
    issueKey: key
  };
});

resolver.define('createIssue', async ({ payload }) => {
  const { summary, parentKey } = payload;

  const response = await api.asUser().requestJira(route`/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        project:{key: "BTB"},
        issuetype: {id: "10440"},
        summary: summary, 
        customfield_11416: [parentKey]
        
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Jira API error response:', data);
    throw new Error(data.errorMessages?.join(',') || JSON.stringify(data) || 'Unknown error creating issue');
  
  }

  return {key:data.key};
});



export const handler = resolver.getDefinitions();