import { formDataBodySerializer } from '../bundle/bodySerializer';

describe('formDataBodySerializer', () => {
  it('serializes number', () => {
    const body = { a: 1 };
    const formData = formDataBodySerializer.bodySerializer(body);
    expect(formData.get('a')).toBe('1');
  });

  it('serializes string', () => {
    const body = { a: 'foo' };
    const formData = formDataBodySerializer.bodySerializer(body);
    expect(formData.get('a')).toBe('foo');
  });

  it('serializes date', () => {
    const body = { a: new Date('2025-01-01T00:00:00.000Z') };
    const formData = formDataBodySerializer.bodySerializer(body);
    expect(formData.get('a')).toBe('2025-01-01T00:00:00.000Z');
  });

  describe('React Native', () => {
    const file = { name: 'photo.jpg', type: 'image/jpeg', uri: 'file:///photo.jpg' };

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('appends file object as-is in React Native', () => {
      vi.stubGlobal('navigator', { product: 'ReactNative' });
      const append = vi.spyOn(FormData.prototype, 'append').mockImplementation(() => {});
      formDataBodySerializer.bodySerializer({ a: file });
      expect(append).toHaveBeenCalledWith('a', file);
      append.mockRestore();
    });

    it('serializes file-like object as JSON outside React Native', () => {
      const formData = formDataBodySerializer.bodySerializer({ a: file });
      expect(formData.get('a')).toBe(JSON.stringify(file));
    });
  });
});
