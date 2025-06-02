import React, { useState, useEffect } from 'react';
import { invoke, router } from '@forge/bridge';
import ForgeReconciler, {
  render,
  Fragment, Text, Button, DynamicTable, Link, Box,
  Modal, ModalBody, ModalTransition, ModalTitle, ModalFooter, ModalHeader,
  Form, useForm, Textfield, Label
} from "@forge/react";
import { view } from '@forge/bridge';

const View = () => {
  const [currentKey, setKey] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const { handleSubmit, getFieldId, register } = useForm();

  const fetchData = async () => {
    try {
    
      await view.getContext();
      const result = await invoke('fetchIssueKey');
      setIssues(result.body);
      setKey(result.issueKey);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setCreating(true);
      const result = await invoke('createIssue', {
        summary: data.summary,
        parentKey: currentKey
      });
      await fetchData();
      closeModal();
      const issueUrl = `https://boardpackager.atlassian.net/browse/${result.key}`;
      router.open(issueUrl);
    } catch (e) {
      console.error('Error creating issue:', e);
    } finally {
      setCreating(false);
    }

  });
  const rows = issues.map((issue, index) => ({
    key: `row-${index}-${issue.key}`,
    cells: [
      {
        key: issue.key,
        content: <Link href={`https://boardpackager.atlassian.net/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">{issue.key}</Link>,
      },
      {
        key: issue.fields.summary,
        content: issue.fields.summary,
      },
      {
        key: issue.fields.status.name,
        content: issue.fields.status.name,
      },
    ],
  }));

  const head = {
    cells: [
      {
        key: "key",
        content: "Key",
        isSortable: true,
      },
      {
        key: "summary",
        content: "Summary",
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: "status",
        content: "Status",
        isSortable: true,
      },

    ],
  };



  if (loading) return <Text>Loading related issues...</Text>;

  const url = `https://boardpackager.atlassian.net/secure/CreateIssueDetails!init.jspa?pid=15034&issuetype=10440&customfield_11416=${currentKey}`

  return (
    <>
      <Button onClick={openModal}
        appearance='primary'
      >Create Bug Ticket
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <Form onSubmit={onSubmit}>
              <ModalHeader>
                <ModalTitle>New Bug Ticket</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Label labelFor={getFieldId('summary')}>
                  Enter Summary for Ticket
                </Label>
                <Textfield{...register('summary')} />
              </ModalBody>
              <ModalFooter>
                <Button appearance='subtle' onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  type="submit"
                  isLoading={creating}
                  isDisabled={creating}
                > {creating ? 'Creating…' : 'Create Ticket'}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        )}
      </ModalTransition>
      <DynamicTable
        caption="Related Bug Issues"
        head={head}
        rows={rows}
        isRankable
      />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <View />
  </React.StrictMode>
);
