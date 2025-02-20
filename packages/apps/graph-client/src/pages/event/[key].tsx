import { useGetEventByNameSubscription } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import routes from '@constants/routes';
import { Box, Breadcrumbs, Notification, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const Event: React.FC = () => {
  const router = useRouter();

  const {
    loading: eventLoading,
    data: eventSubscription,
    error,
  } = useGetEventByNameSubscription({
    variables: { eventName: router.query.key as string },
  });

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Events</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

      <main className={mainStyle}>
        <div>
          {eventLoading && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Waiting for event...</span>
            </div>
          )}

          {error && (
            <Notification.Root color="negative" icon="Close" variant="outlined">
              Unknown error:
              <br />
              <br />
              <code>{error.message}</code>
              <br />
              <br />
              Check if the Graph server is running.
            </Notification.Root>
          )}

          {eventSubscription?.event && (
            <div style={{ maxWidth: '1000px' }}>
              <Table.Root striped wordBreak="break-word">
                <Table.Head>
                  <Table.Tr>
                    <Table.Th>Event Name</Table.Th>
                    <Table.Th>Parameters</Table.Th>
                    <Table.Th>Request Key</Table.Th>
                  </Table.Tr>
                </Table.Head>
                <Table.Body>
                  {eventSubscription.event.map((event, index) => (
                    <Table.Tr
                      key={index}
                      url={`${routes.TRANSACTIONS}/${event.transaction?.requestKey}`}
                    >
                      <Table.Td>{event.qualifiedName}</Table.Td>
                      <Table.Td>
                        <Table.Root>
                          <Table.Body>
                            {JSON.parse(event.parameterText).map(
                              (parameter: any, index: number) => (
                                <Table.Tr key={`arguments-${index}`}>
                                  <Table.Td>
                                    {typeof parameter === 'string' ? (
                                      parameter
                                    ) : typeof parameter === 'object' ? (
                                      <Table.Root>
                                        <Table.Body>
                                          {parameter.map(
                                            (
                                              subparameter: any,
                                              index: number,
                                            ) => (
                                              <Table.Tr
                                                key={`arguments-${index}`}
                                              >
                                                <Table.Td>
                                                  {typeof subparameter ===
                                                  'string' ? (
                                                    subparameter
                                                  ) : (
                                                    <pre>
                                                      {JSON.stringify(
                                                        subparameter,
                                                      )}
                                                    </pre>
                                                  )}
                                                </Table.Td>
                                              </Table.Tr>
                                            ),
                                          )}
                                        </Table.Body>
                                      </Table.Root>
                                    ) : (
                                      JSON.stringify(parameter)
                                    )}
                                  </Table.Td>
                                </Table.Tr>
                              ),
                            )}
                          </Table.Body>
                        </Table.Root>
                      </Table.Td>
                      <Table.Td>{event.transaction?.requestKey}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Event;
