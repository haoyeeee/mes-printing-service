import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useAuth0 } from "@auth0/auth0-react";
import { FormItem, FormControl, FormLabel, FormDescription, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    userId: z.string(),
    modelFile: z.string().optional(),
});

export default function UploadForm() {
  // const { user } = useAuth0();
  // const userId = user?.sub; // 'sub' is the Auth0 user_id
  const userId = "hardcoded-user-id-123"; // for testing

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        userId: userId,
        modelFile: undefined,
    },
  });

  const { register, handleSubmit } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>User ID</FormLabel>
          <FormControl>
            <Input type="text" {...register("userId")} readOnly />
          </FormControl>
          <FormDescription>
            Your unique user ID.
          </FormDescription>
        </FormItem>

        <FormItem>
          <FormLabel>Model File</FormLabel>
          <FormControl>
            <Input type="file" {...register("modelFile")} />
          </FormControl>
          <FormDescription>
            Upload your 3D model file here.
          </FormDescription>
        </FormItem>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

