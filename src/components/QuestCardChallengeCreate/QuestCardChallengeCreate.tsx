import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { cardService } from "../services/cardService";
import type { CreateCardPayload } from "../types/card";
import { DIFFICULTIES, CATEGORIES } from "../data/constants";
import css from "./QuestCardChallengeCreate.module.css";

interface Props {
    onClose: () => void;
}

const validationSchema = Yup.object({
    title: Yup.string().min(2).max(100).required("Required"),
    difficulty: Yup.string().oneOf(DIFFICULTIES).required(),
    category: Yup.string().oneOf(CATEGORIES).required(),
    date: Yup.string().required(),
    time: Yup.string().required(),
});

export default function QuestCardChallengeCreate({ onClose }: Props) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newCard: CreateCardPayload) =>
            cardService.createCard(newCard),
        onSuccess: () => {
            toast.success("Challenge created!");
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            onClose(); // Закрываем модальное окно после успеха
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Creation failed");
        },
    });

    return (
        <div className={css.modalBackdrop}>
            <div className={css.modalContent}>
                <Formik
                    initialValues={
                        {
                            title: "",
                            difficulty: "Hard",
                            category: "Learning",
                            date: new Date().toISOString().split("T")[0],
                            time: "12:00",
                            type: "Challenge", // Тип жестко задан
                        } as CreateCardPayload
                    }
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        mutation.mutate(values);
                    }}
                >
                    <Form>
                        <h2>Create a Challenge</h2>
                        <Field name="title" placeholder="Title" />
                        <ErrorMessage name="title" component="div" />

                        <Field as="select" name="difficulty">
                            {DIFFICULTIES.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </Field>

                        <Field as="select" name="category">
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </Field>

                        <Field type="date" name="date" />
                        <Field type="time" name="time" />

                        <div className={css.buttonGroup}>
                            <button type="button" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" disabled={mutation.isPending}>
                                Create
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
