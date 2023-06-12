import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Option, Select } from '@/components/Global';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
  StyledNavItem,
  StyledNavItemIcon,
  StyledNavItemSelectedText,
  StyledNavItemText,
  StyledResultContainer,
  StyledSelectedNavItem,
  StyledSidebar,
  StyledTotalChunk,
  StyledTotalContainer,
} from '@/pages/coin-transfer/styles';
import {
  type TransferResult,
  coinTransfer,
} from '@/services/transfer/coin-transfer';
import { convertIntToChainId } from '@/services/utils/utils';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

const CoinTransfer: FC = () => {
  const { t } = useTranslation('common');
  const NETWORK_ID = 'testnet04';
  const chainId = '1';
  const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`;
  const numberOfChains = 20;

  const [senderAccount, setSenderAccount] = useState<string>('');
  const [receiverAccount, setReceiverAccount] = useState<string>('');
  const [coinAmount, setCoinAmount] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [senderChain, setSenderChain] = useState<number>(1);
  const [receiverChain, setReceiverChain] = useState<number>(1);
  const [results, setResults] = useState<TransferResult>({});

  const handleTransfer = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();

      const pactCommand = await coinTransfer({
        fromAccount: senderAccount,
        fromChainId: convertIntToChainId(senderChain),
        toAccount: receiverAccount,
        toChainId: convertIntToChainId(receiverChain),
        amount: coinAmount,
        fromPrivateKey: privateKey,
        networkId: NETWORK_ID,
      });

      const requestKey = pactCommand.requestKey;

      const pollResult = await pactCommand.pollUntil(API_HOST, {
        onPoll: async (transaction, pollRequest): Promise<void> => {
          console.log(`Polling ${requestKey}.\nStatus: ${transaction.status}`);
          setResults({ ...transaction });
          console.log(await pollRequest);
        },
      });

      setResults({ ...pollResult });
    } catch (e) {
      console.log(e);
      if (e.statsus || e.requestKey) {
        setResults({ ...e });
        return;
      }
      setResults({ requestKey: 'Could not create request', status: e.message });
    }
  };

  const renderChainOptions = (): JSX.Element[] => {
    const options = [];
    for (let i = 0; i < numberOfChains; i++) {
      options.push(
        <Option value={i} key={i}>
          {' '}
          {i}
        </Option>,
      );
    }
    return options;
  };

  return (
    <MainLayout title={t('Kadena Coin Transfer')}>
      <StyledMainContent>
        <StyledSidebar>
          <StyledSelectedNavItem href="/coin-transfer">
            <StyledNavItemIcon>K:</StyledNavItemIcon>
            <StyledNavItemSelectedText>
              {t('Transfer')}
            </StyledNavItemSelectedText>
          </StyledSelectedNavItem>
          <StyledNavItem href="/coin-transfer/cross-chain-transfer-finisher">
            <StyledNavItemIcon>K:</StyledNavItemIcon>
            <StyledNavItemText>
              {t('Cross Chain Transfer Finisher')}
            </StyledNavItemText>
          </StyledNavItem>
        </StyledSidebar>
        <StyledForm onSubmit={handleTransfer}>
          <StyledAccountForm>
            <TextField
              label={t('Sender Account')}
              inputProps={{
                placeholder: t('Enter account name of the sender'),
                // @ts-ignore
                onChange: (e) => setSenderAccount(e?.target?.value),
                value: senderAccount,
              }}
            />
            <Select
              label={t('Select the chain of the sender')}
              leadingText={t('Chain')}
              onChange={(e) => setSenderChain(parseInt(e.target.value))}
              value={senderChain}
            >
              {renderChainOptions()}
            </Select>
            <TextField
              label={t('Receiver Account')}
              inputProps={{
                placeholder: t('Enter account name of the receiver'),
                // @ts-ignore
                onChange: (e) => setReceiverAccount(e?.target?.value),
                value: receiverAccount,
              }}
            />
            <Select
              label={t('Select the chain of the receiver')}
              leadingText={t('Chain')}
              onChange={(e) => setReceiverChain(parseInt(e.target.value))}
              value={receiverChain}
            >
              {renderChainOptions()}
            </Select>
            <TextField
              label={t('Amount')}
              inputProps={{
                placeholder: t('Enter amount to transfer'),
                // @ts-ignore
                onChange: (e) => setCoinAmount(e?.target?.value),
                value: coinAmount,
              }}
            />
            <TextField
              label={t('Sign')}
              inputProps={{
                placeholder: t('Enter private key to sign the transaction'),
                // @ts-ignore
                onChange: (e) => setPrivateKey(e?.target?.value),
                value: privateKey,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Make Transfer')}>{t('Make Transfer')}</Button>
          </StyledFormButton>
        </StyledForm>

        {Object.keys(results).length > 0 ? (
          <StyledResultContainer>
            <StyledTotalContainer>
              <StyledTotalChunk>
                <p>{t('Request Key')}</p>
                <p>{results.requestKey}</p>
              </StyledTotalChunk>
              <StyledTotalChunk>
                <p>Status</p>
                <p>{results.status}</p>
              </StyledTotalChunk>
            </StyledTotalContainer>
          </StyledResultContainer>
        ) : null}
      </StyledMainContent>
    </MainLayout>
  );
};

export default CoinTransfer;
