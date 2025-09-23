import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { cardService } from "../services/cardService";
import { DIFFICULTIES, CATEGORIES } from "../data/constants";
import type { CreateCardPayload, CardType } from "../types/card";
import css from "./QuestCardCreate.module.css";
import { MdOutlineClear, MdCalendarMonth } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { getErrorMessage } from "../utils/errorUtils";

interface Props {
    closeForm: () => void;
    type: CardType;
}

const validationSchema = Yup.object({
    title: Yup.string()
        .min(2, "Too Short!")
        .max(100, "Too Long!")
        .required("Required"),
    difficulty: Yup.string().oneOf(DIFFICULTIES).required(),
    category: Yup.string().oneOf(CATEGORIES).required(),
    date: Yup.string().required(),
    time: Yup.string().required(),
});

export default function QuestCardCreate({ closeForm, type }: Props) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newCard: CreateCardPayload) =>
            cardService.createCard(newCard),
        onSuccess: () => {
            toast.success(`${type} created!`);
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            closeForm();
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Creation failed"));
        },
    });

    // ЯВНО УКАЗЫВАЕМ ТИП ДЛЯ INITIALVALUES
    const initialValues: CreateCardPayload = {
        title: "",
        difficulty: type === "Challenge" ? "Hard" : "Normal",
        category: "Stuff",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        type: type,
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                // Теперь 'values' имеет правильный тип CreateCardPayload
                mutation.mutate(values);
            }}
        >
            {() => (
                <Form className={css.cardContainer}>
                    <div className={css.cardHeader}>
                        <div className={css.cardHeaderSelector}>
                            <Field
                                as="select"
                                name="difficulty"
                                className={css.levelTitle}
                            >
                                {DIFFICULTIES.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        {type === "Challenge" && <GiTrophy color="#00d7ff" />}
                    </div>

                    <div className={css.inputContainer}>
                        <div className={css.cardTitle}>
                            CREATE NEW {type.toUpperCase()}
                        </div>
                        <Field
                            type="text"
                            name="title"
                            className={css.cardInput}
                            placeholder="Title..."
                        />
                        <ErrorMessage
                            name="title"
                            component="div"
                            className={css.errorText}
                        />
                    </div>

                    <div className={css.dateContainer}>
                        <Field type="date" name="date" />
                        <Field type="time" name="time" />
                        <MdCalendarMonth color="#00d7ff" />
                    </div>

                    <div className={css.cardBottomContainer}>
                        <Field
                            as="select"
                            name="category"
                            className={css.categorySelector}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </Field>
                        <div className={css.buttonList}>
                            <button
                                type="button"
                                onClick={closeForm}
                                className={css.clearButton}
                            >
                                <MdOutlineClear
                                    color="#db0837"
                                    className={css.iconSave}
                                />
                            </button>
                            <div className={css.separatorContainer}></div>
                            <button
                                type="submit"
                                className={css.startButton}
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "..." : "START"}
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
