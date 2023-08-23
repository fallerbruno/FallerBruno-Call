import { Button, TextInput } from "@faller-bruno-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "usuário deve ter no mínimo 3 caracteres" })
    .max(20, { message: "usuário deve ter no máximo 20 caracteres" })
    .regex(/([a-z\\-]+$)/i, {
      message: "usuário deve conter apenas letras e hifens",
    })
    .transform((username) => username.toLowerCase()),
  // Regex que define que so podem letras e hifens
});

type ClaimUserNameFormData = z.infer<typeof claimUserNameFormSchema>;

export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameFormSchema),
  });

  async function handleClaimUsername(data: ClaimUserNameFormData) {
    toast.success("Usuário reservado com sucesso!");
  }

  useEffect(() => {
    if (errors.username) {
      toast.error(errors.username.message);
    }
  }, [errors.username]);

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="fallerbruno.com/"
          placeholder="seu-usuário"
          {...register("username")}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
    </>
  );
}
