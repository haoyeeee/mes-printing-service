import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useAuth0 } from "@auth0/auth0-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { useState } from "react";
import * as THREE from "three";
import { FormItem, FormControl, FormLabel, FormDescription, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader.js';

const formSchema = z.object({
    userId: z.string(),
    modelFile: z.any().optional(),
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
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [object, setObject] = useState<THREE.Group | null>(null);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        if (values.modelFile && values.modelFile[0]) {
            const file = values.modelFile[0];
            const url = URL.createObjectURL(file);
            setModelUrl(url);

            const loader = new GCodeLoader();
            loader.load(url, (loadedObject) => {
                console.log("Loaded Object:", loadedObject); 
                setObject(loadedObject);
            }, undefined, (error) => {
                console.error("Error loading GCode:", error); 
            });
        }
    }

    function ModelViewer() {
        if (!object) return null;
        return <primitive object={object} />;
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                        <Input type="text" {...register("userId")} readOnly />
                    </FormControl>
                    <FormDescription>Your unique user ID.</FormDescription>
                </FormItem>

                <FormItem>
                    <FormLabel>Model File</FormLabel>
                    <FormControl>
                        <Input type="file" {...register("modelFile")} />
                    </FormControl>
                    <FormDescription>Upload your 3D model file here.</FormDescription>
                </FormItem>

                <Button type="submit">Submit</Button>
            </form>
            {modelUrl && (
                <Canvas style={{ width: '100%', height: '500px' }}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <ModelViewer />
                    <OrbitControls />
                </Canvas>
            )}
        </Form>
    );
}
