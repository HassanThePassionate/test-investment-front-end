/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper function to debug FormData contents
 * FormData can't be directly console.logged, so this function
 * converts it to a readable object
 */
export function debugFormData(formData: FormData): Record<string, any> {
    const object: Record<string, any> = {}
    formData.forEach((value, key) => {
      // Don't try to convert File objects to string
      if (value instanceof File) {
        object[key] = `File: ${value.name} (${value.type}, ${value.size} bytes)`
      } else {
        object[key] = value
      }
    })
    return object
  }
  