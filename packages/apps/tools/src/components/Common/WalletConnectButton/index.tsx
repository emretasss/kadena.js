import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { Button } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';

const WalletConnectButton: FC = () => {
  const { connect, isInitializing, disconnect, session } =
    useWalletConnectClient();
  const { t } = useTranslation('common');

  const handleClick = async (): Promise<void> => {
    if (session) {
      await disconnect();
      return;
    }

    await connect();
  };

  const buttonTitle = session ? t('Logout') : t('Connect your wallet');

  return (
    <Button
      title={buttonTitle}
      color="positive"
      icon="Link"
      iconAlign="right"
      onClick={handleClick}
      disabled={isInitializing}
      loading={isInitializing}
    >
      {buttonTitle}
    </Button>
  );
};

export default WalletConnectButton;
