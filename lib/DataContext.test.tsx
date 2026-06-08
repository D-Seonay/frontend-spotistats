import { render, screen, act } from '@testing-library/react'
import { DataProvider, useData } from './DataContext'
import { expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'

function TestComponent() {
  const { metadata, updateMetadata } = useData()
  
  return (
    <div>
      <div data-testid="metadata-images">
        {Object.keys(metadata.images).length}
      </div>
      <div data-testid="image-url">
        {metadata.images['Gazo'] || 'none'}
      </div>
      <button 
        data-testid="update-button"
        onClick={() => updateMetadata({ images: { 'Gazo': 'http://example.com/gazo.png' } })}
      >
        Update
      </button>
      <button 
        data-testid="update-more-button"
        onClick={() => updateMetadata({ images: { 'Jul': 'http://example.com/jul.png' } })}
      >
        Update More
      </button>
    </div>
  )
}

test('DataContext provides metadata and updateMetadata', async () => {
  const user = userEvent.setup()
  render(
    <DataProvider>
      <TestComponent />
    </DataProvider>
  )

  // Initial state: images should be empty
  expect(screen.getByTestId('metadata-images')).toHaveTextContent('0')
  expect(screen.getByTestId('image-url')).toHaveTextContent('none')

  // Update metadata
  await act(async () => {
    await user.click(screen.getByTestId('update-button'))
  })

  // State after first update
  expect(screen.getByTestId('metadata-images')).toHaveTextContent('1')
  expect(screen.getByTestId('image-url')).toHaveTextContent('http://example.com/gazo.png')
  
  // Update metadata again to check if it merges deeply
  await act(async () => {
    await user.click(screen.getByTestId('update-more-button'))
  })
  
  expect(screen.getByTestId('metadata-images')).toHaveTextContent('2')
  expect(screen.getByTestId('image-url')).toHaveTextContent('http://example.com/gazo.png') // old image should remain
})