import { mount } from '@vue/test-utils';
import ExampleComponent from '@/components/ExampleComponent.vue';

describe('ExampleComponent', () => {
  test('removeImage removes image from imageBase64Array and updates local storage', () => {

    const initialImageData: string[] = ['image1', 'image2', 'image3'];
    localStorage.setItem('uploadedImages', JSON.stringify(initialImageData));

    const wrapper = mount(ExampleComponent);

    (wrapper.vm as any).removeImage(1);


    expect(wrapper.vm.imageBase64Array).toEqual(['image1', 'image3']);

    const updatedImageData = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
    expect(updatedImageData).toEqual(['image1', 'image3']);

    // Check if errorMessage is set to "Image removed successfully."
    expect(wrapper.vm.errorMessage).toBe("Image removed successfully.");
  });
});