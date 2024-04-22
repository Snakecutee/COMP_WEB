import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor";
import "../customLibStyle/ckeditor.css";
import {
  tokenRequestInterceptor,
  uploadSupportDocument,
  uploadEditorContent,
  getAllAcademic,
  getMagazineById,
  updateIdea,
} from "../apiServices/index";
import { getSingleIdea } from "../apiServices";
import { getNewToken } from "../store/actions/authenticateAction";
import Form from "./form";
import Button from "./button";
import InputField from "./inputField";
import TextArea from "./text-area";
import SelectOption from "./SelectOption";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DocumentAddIcon,
  SwitchHorizontalIcon,
  DocumentIcon,
  XIcon,
} from "@heroicons/react/solid";
import FileUpload from "./fileUpload";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageCustom from "./errorMessage";
import { toast } from "react-toastify";
import TermAndCondition from "./submission";

import Indicator from "./indicator";
import { useSearchParams } from "react-router-dom";
import IdeaDetail from "./IdeaDetail";

const ideaSubmitValidateSchema = yup.object().shape({
  title: yup.string().required("Title cannot be empty"),
  description: yup.string().required("Description cannot be empty"),
});

const EditIdea = ({ authenticateReducer, getNewTokenRequest }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [switchUpload, setSwitchUpload] = useState(true);
  const [file, setFile] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [agree, setAgree] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [editorData, setEditorData] = useState();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disablePost, setDisablePost] = useState(false);
  const [magazineDetail, setMagazineDetail] = useState({});
  const { token, user } = authenticateReducer;
  const [searchParams, setSearchParams] = useSearchParams();
  const [ideaDetail, setIdeaDetail] = useState({});
  const navigate = useNavigate();

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleChangeDesc = (event) => {
    setDescription(event.target.value);
  };

  const { id } = useParams();
  const getIdeaDetail = useCallback(async () => {
    // setIsLoading(true);
    const { data, status } = await getSingleIdea(id, token);

    if (status === 200) {
      setIdeaDetail(data.data);
    }
  }, [id, token, user.id]);

  useEffect(() => {
    getIdeaDetail();
  }, []);

  useEffect(() => {
    if (ideaDetail && Object.keys(ideaDetail).length !== 0) {
      setTitle(ideaDetail.title);
      setDescription(ideaDetail.description);
      console.log("da cap nhat thanh cong", ideaDetail);
      setIsLoading(false);
    }
  }, [ideaDetail]);

  const handleUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);

    setFile((prevFiles) => {
      if (Array.isArray(prevFiles)) {
        return [...prevFiles, ...uploadedFiles];
      } else {
        return [...uploadedFiles];
      }
    });
  };

  const magazineId = searchParams.get("magazineId");
  const getMegazineDetail = useCallback(async () => {
    if (magazineId) {
      const { data, status } = await getMagazineById(token, magazineId);
      if (status === 200) {
        setMagazineDetail(data);
      }
    }
  }, [magazineId, token, user._id]);
  useEffect(() => {
    getMegazineDetail();
  }, [getMegazineDetail]);
  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(ideaSubmitValidateSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
  
    },
  });

  const getAcademicYear = useCallback(async () => {
    const loadAcademicYear = async () => {
      const { data, status } = await getAllAcademic(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAcademicYear,
      getNewTokenRequest
    );
    if (status === 200 && data.length > 0) {
      setAcademic(data);
      setValue("academy", data[0].name);
      const newestYear = data[data.length - 1];
      const closureDate = new Date(newestYear.closureDate);
      if (closureDate < Date.now()) {
        setDisablePost(true);
      }
    }
  }, [token, getNewTokenRequest]);

  useEffect(() => {
    getAcademicYear();
  }, [getAcademicYear]);

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const submitIdeaHandler = async (formData) => {
    setIsLoading(true);
    let documentLink = ideaDetail.documentLink;
    if (file.length > 0) {
      for (const fileItem of file) {
        const documentUpload = new FormData();
        documentUpload.append("document", fileItem);

        const { data, status } = await uploadSupportDocument(
          documentUpload,
          token
        );

        if (status === 201) {
          documentLink.push(data.documentLink);
        }
      }
    }
    console.log("document link", documentLink);
    let ideaSubmitBody = {
      ...formData,
      title: formData.title
        .split(" ")
        .map((word) => capitalize(word))
        .join(" "),
      documentLink,
      magazineId: magazineId,
    };

    const endDate = new Date(magazineDetail.endDate);
    const currentDate = new Date();
    if (endDate < currentDate) {
      toast.error(
        "Due to its outdated nature, the magazine cannot update idea."
      );
      return;
    }

    const uploadIdea = await updateIdea(ideaSubmitBody, id, token);
    if (uploadIdea.status === 201) {
      toast.success(uploadIdea.data.message);
      reset();
      setFile(null);
      setEditorData("");
      setIsLoading(false);
      setAgree(false);
      navigate("/");
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...file];
    updatedFiles.splice(index, 1);
    setFile(updatedFiles);
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Indicator open={loading} />

          <div className="w-screen md:max-w-4xl mx-auto my-20">
            <TermAndCondition open={termOpen} setOpen={setTermOpen} />
            <Form title="Contribute Idea">
              <div className="w-full text-center">{magazineDetail.name}</div>

              <InputField
                {...register("title")}
                type="text"
                value={title}
                onChange={handleChangeTitle}
                placeholder="Idea Title"
              />
              <ErrorMessage
                name="title"
                errors={errors}
                render={({ message }) => (
                  <ErrorMessageCustom message={message} />
                )}
              />
              <SelectOption
                {...register("academy")}
                defaultValue={getValues("academy")}
                listData={academic.filter((item) => !item.deleted)}
              />
              <TextArea
                {...register("description")}
                rows={5}
                value={description}
                onChange={handleChangeDesc}
                placeholder="Idea Description"
              />
              <ErrorMessage
                name="description"
                errors={errors}
                render={({ message }) => (
                  <ErrorMessageCustom message={message} />
                )}
              />
              {switchUpload ? (
                <div className="w-full flex flex-col justify-start align-top">
                  <span className="text-lg">Upload Document:</span>
                  {file?.length !== 0 ? (
                    file?.map((fileItem, index) => (
                      <div
                        key={index}
                        className="flex justify-start items-center bg-gray-400 w-fit p-2 rounded-md mt-2"
                      >
                        <DocumentIcon className="h-7 w-7 text-gray-200" />
                        <span className="text-lg">{fileItem.name}</span>
                        <XIcon
                          className="h-5 w-5 text-white cursor-pointer"
                          onClick={() => removeFile(index)}
                        />
                      </div>
                    ))
                  ) : (
                    <FileUpload
                      onChange={handleUpload}
                      multiple={true}
                      accept=".doc,.docx,.jpeg,.jpg,.png,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                  )}
                </div>
              ) : (
                <CKEditor
                  editor={ClassicEditor}
                  data={editorData}
                  onReady={(editor) => {
                    editor.ui
                      .getEditableElement()
                      .parentElement.insertBefore(
                        editor.ui.view.toolbar.element,
                        editor.ui.getEditableElement()
                      );
                  }}
                  onChange={(event, editor) => setEditorData(editor.getData())}
                  timestamp="ABCD"
                />
              )}
              <div className="w-full flex justify-start items-center gap-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  By checking this checkbox, you had agreed with our{" "}
                  <span
                    onClick={() => setTermOpen(true)}
                    className="border-2 border-transparent cursor-pointer text-blue-500 py-1 hover:border-b-blue-500"
                  >
                    Terms & Conditions
                  </span>
                </span>
              </div>
              <div className="flex p-1">
                <Button
                  type="primary"
                  role="button"
                  title="Submit Idea"
                  onClick={handleSubmit(submitIdeaHandler)}
                  icon={DocumentAddIcon}
                  disabled={!agree}
                />
              </div>
            </Form>
          </div>
        </>
      ) : (
        <Indicator open={isLoading} />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditIdea);
