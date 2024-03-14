import { describe, expect, test } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import ExampleComponent from '@/components/ExampleComponent.vue'

describe('ExampleComponent', () => {
  test('handleFileUpload adds image to imageBase64Array', async () => {
    const wrapper = shallowMount(ExampleComponent)
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')

    await input.trigger('change', {
      target: { files: [file] }
    })

    expect(wrapper.vm.imageBase64Array).toHaveLength(1)
  })

  test('removeImage removes image from imageBase64Array', () => {
    const wrapper = shallowMount(ExampleComponent, {
      data() {
        return {
          imageBase64Array: ['image1', 'image2', 'image3']
        }
      }
    })

    wrapper.vm.removeImage(1) // Remove second image
    expect(wrapper.vm.imageBase64Array).toEqual(['image1', 'image3'])
  })

  test('loads image data from localStorage on mount', () => {
    const imageData = JSON.stringify(['image1', 'image2'])
    localStorage.setItem('uploadedImages', imageData)

    const wrapper = shallowMount(ExampleComponent)

    expect(wrapper.vm.imageBase64Array).toEqual(['image1', 'image2'])
  })

})