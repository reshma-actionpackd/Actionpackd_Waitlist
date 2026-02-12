import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '64px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          fontSize: '36px',
          fontWeight: 700,
          color: '#ff0000',
        }}
      >
        A
      </div>
    ),
    {
      ...size,
    },
  );
}
