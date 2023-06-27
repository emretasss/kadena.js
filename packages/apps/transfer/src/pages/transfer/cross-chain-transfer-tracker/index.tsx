import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import {
  Button,
  Heading,
  SystemIcons,
  TextField,
} from '@kadena/react-components';

import {
  StyledInfoItem,
  StyledInfoItemLine,
  StyledInfoItemTitle,
  StyledInfoTitle,
} from '../cross-chain-transfer-finisher/styles';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { kadenaConstants } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import {
  StyledAccountForm,
  StyledInfoBox,
  StyledMainContent,
  StyledForm,
  StyledFormButton,
  StyledInfoTitle1,
  StyledInfoItem1,
  StyledInfoItemTitle1,
  StyledInfoItemLine1,
} from '@/pages/transfer/cross-chain-transfer-tracker/styles';
import {
  getTransferStatus,
  StatusData,
} from '@/services/cross-chain-transfer-tracker/get-transfer-status';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';
import FormStatusNotification from './notification';

export type RequestStatus = 'not started' | 'pending' | 'succeeded' | 'failed';

const CrossChainTransferTracker: FC = () => {
  const { network } = useAppContext();

  const chainNetwork: {
    Mainnet: { server: string; network: string };
    Testnet: { server: string; network: string };
  } = {
    Mainnet: {
      server: kadenaConstants.MAINNET.API,
      network: kadenaConstants.MAINNET.NETWORKS.MAINNET01,
    },
    Testnet: {
      server: kadenaConstants.TESTNET.API,
      network: kadenaConstants.TESTNET.NETWORKS.TESTNET04,
    },
  };

  const { t } = useTranslation('common');
  const [requestKey, setRequestKey] = useState<string>('');
  const [data, setData] = useState<StatusData>({});
  const [requestStatus, setRequestStatus] = useState<{
    status: RequestStatus;
    message?: string;
  }>({ status: 'not started' });
  const router = useRouter();

  useEffect(() => {
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
    }
  }, [router.query]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    router.query.reqKey = requestKey;
    await router.push(router);
    // setRequestStatus({ status: 'pending' });
    let statusId;
    try {
      await getTransferStatus({
        requestKey,
        server: chainNetwork[network].server,
        networkId: chainNetwork[network].network as ChainwebNetworkId,
        t,
        options: {
          onPoll: (status) => {
            statusId = status.id;
            setData(status);
          },
        },
      });

      // if (statusId == 2) {
      //   setRequestStatus({ status: 'succeeded' });
      // } else {
      //   setRequestStatus({ status: 'failed' });
      // }
    } catch (error) {
      setRequestStatus({ status: 'failed', message: error.message });
    }
  };

  return (
    <MainLayout title={t('Track & trace transactions')}>
      <StyledMainContent>
        <StyledForm onSubmit={handleSubmit}>
          <FormStatusNotification
            status={requestStatus.status}
            body={requestStatus.message}
          />
          <StyledAccountForm>
            <Heading as="h5">Search Request</Heading>
            <TextField
              label={t('Request Key')}
              inputProps={{
                placeholder: t('Enter Request Key'),
                onChange: (e) =>
                  setRequestKey((e.target as HTMLInputElement).value),
                value: requestKey,
                leftPanel: SystemIcons.KeyIconFilled,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Search')}>
              {t('Search')}
              <SystemIcons.Magnify />
            </Button>
          </StyledFormButton>
          <StyledInfoItem1>
            <div>
              <SystemIcons.Account></SystemIcons.Account>
            </div>
            <div>
              <StyledInfoItemTitle1>{t('Sender')}</StyledInfoItemTitle1>
              <StyledInfoItemLine1>{data.senderAccount}</StyledInfoItemLine1>
              <StyledInfoItemTitle1>{t('Chain')}</StyledInfoItemTitle1>
              <StyledInfoItemLine1>{data.senderChain}</StyledInfoItemLine1>
            </div>
          </StyledInfoItem1>
        </StyledForm>

        {data.status ? (
          <StyledInfoBox>
            <StyledInfoTitle>{t('Transfer Information')}</StyledInfoTitle>

            {data.receiverAccount ? (
              <>
                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Sender')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{`Chain: ${data.senderChain}`}</StyledInfoItemLine>
                  <StyledInfoItemLine>{`Account: ${data.senderAccount}`}</StyledInfoItemLine>
                </StyledInfoItem>

                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Receiver')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{`Chain: ${data.receiverChain}`}</StyledInfoItemLine>
                  <StyledInfoItemLine>{`Account: ${data.receiverAccount}`}</StyledInfoItemLine>
                </StyledInfoItem>

                <StyledInfoItem>
                  <StyledInfoItemTitle>{t('Amount')}</StyledInfoItemTitle>
                  <StyledInfoItemLine>{` ${data.amount} ${t(
                    'KDA',
                  )}`}</StyledInfoItemLine>
                </StyledInfoItem>
              </>
            ) : null}

            <StyledInfoItem>
              <StyledInfoItemTitle>{t('Status')}</StyledInfoItemTitle>
              <StyledInfoItemLine>{`${data.status} `}</StyledInfoItemLine>
            </StyledInfoItem>

            <StyledInfoItem>
              <StyledInfoItemTitle>{t('Description')}</StyledInfoItemTitle>
              <StyledInfoItemLine>{`${data.description} `}</StyledInfoItemLine>
            </StyledInfoItem>
          </StyledInfoBox>
        ) : null}
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferTracker;
