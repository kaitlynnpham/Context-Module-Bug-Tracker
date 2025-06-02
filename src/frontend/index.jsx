import React, { useState, useEffect } from 'react';
import { invoke, router } from '@forge/bridge';
import ForgeReconciler, {
  Text, Button, DynamicTable, Link, Box,
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
      //wait for ticket to be created, block user from pressing submit again
      setCreating(true);
      const result = await invoke('createIssue', {
        summary: data.summary,
        parentKey: currentKey
      });

      // refresh table with newly created ticket
      await fetchData();
      closeModal();
      // change to your company's jira website
      const issueUrl = `https:/{enter company website}.atlassian.net/browse/${result.key}`;
      // open new ticket in different tab
      router.open(issueUrl);
    } catch (e) {
      console.error('Error creating issue:', e);
    } finally {
      setCreating(false);
    }

  });
  // set rows for dynamic table
  const rows = issues.map((issue, index) => ({
    key: `row-${index}-${issue.key}`,
    cells: [
      {
        key: issue.key,
        //change link to company's website
        content: <Link href={`https://{enter company website}.atlassian.net/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">{issue.key}</Link>,
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

  // set head for dynamic table
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


  // loading table message
  if (loading) return <Text>Loading related issues...</Text>;

  return (
    <>
      {/* Display button to open modal to create ticket and enter summary */}
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
      {/* display table with related bug issues */}
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
