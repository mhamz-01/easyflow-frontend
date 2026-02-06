import { api } from "../client";

// return presign url
export const createPresignUrl = async ({
  fileName,
  fileType,
  fileSize,
}: {
  fileName: string;
  fileType: string;
  fileSize: number;
}) => {
  const res = await api.post("/files/presign", {
    fileName,
    fileType,
    fileSize,
  });

  return res.data;
};

// get presign url and upload files
export const uploadFile = async (file: File) => {
  const { uploadUrl, fileId } = await createPresignUrl({
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return fileId;
};

// delete file from R2 + DB
export const deleteFile = async (fileId: number) => {
  const response = await api.delete("/files/delete", { params: { fileId } });
  return response.data;
};
