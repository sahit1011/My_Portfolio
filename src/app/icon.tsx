import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Dynamic favicon: phosphor "a" monogram on near-black (matches the nav mark).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070809',
          color: '#7FE0C2',
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        a
      </div>
    ),
    { ...size }
  );
}
