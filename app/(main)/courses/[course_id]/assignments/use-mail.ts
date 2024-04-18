import { useState, useEffect } from 'react';
import { Mail, mails } from './data';

type MailState = {
  selected: Mail['id'] | null;
};

export function useMail() {
  const [mail, setMail] = useState<MailState>({
    // ...mails[0],
    selected: mails[0].id,
  });

  // console.log('🚀 ~ useMail ~ mail:', mail);
  useEffect(() => {
    console.log('setMail was called, new mail state:', mail);
  }, [mail]);

  return { mail, setMail };
}
