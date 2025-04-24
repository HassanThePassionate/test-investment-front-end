"use server"

import { z } from "zod"

// Server-side validation schema
const contactFormSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  phone_number: z.string().min(9),
  password: z.string().min(8),
  location: z.string().min(2),
  occupation: z.string().min(2),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export async function submitContactForm(formData: ContactFormData) {
  // Validate the data on the server side
  try {
    const validatedData = contactFormSchema.parse(formData)

    // Simulate a delay for the API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Here you would typically:
    // 1. Save to a database
    // 2. Send an email notification
    // 3. Integrate with a CRM

    console.log("Form submitted successfully:", validatedData)

    // For demonstration, we'll just return success
    return { success: true }
  } catch (error) {
    console.error("Form validation error:", error)
    if (error instanceof z.ZodError) {
      throw new Error("Dados inválidos. Por favor, verifique os campos e tente novamente.")
    }
    throw new Error("Falha ao enviar o formulário. Por favor, tente novamente mais tarde.")
  }
}
