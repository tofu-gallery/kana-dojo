'use client';

// Added by Tofu (tofu-gallery/kana-dojo) on 2026-10-24: a "Source code" link at
// the foot of every page on screens narrower than the desktop layout, where the
// bottom bar (BottomBar.tsx, which carries the same link) is hidden. It opens
// this copy's own source code (GNU AGPL v3, section 13). See TOFU.md.
import { useClick } from '@/shared/hooks/generic/useAudio';
import { SOURCE_CODE_URL } from '@/shared/config/sourceCode';

const SourceCodeFooter = () => {
  const { playClick } = useClick();

  return (
    <footer className='flex justify-center px-4 pt-2 pb-20 lg:hidden'>
      <a
        href={SOURCE_CODE_URL}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => playClick()}
        className='text-xs text-(--secondary-color) underline hover:text-(--main-color)'
      >
        Source code
      </a>
    </footer>
  );
};

export default SourceCodeFooter;
