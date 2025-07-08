import React from "react";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface NoteStruc {
  _id: string;
  title: string;
  content: string;
}

const NoteCard = ({ noteItem }: { noteItem: NoteStruc }) => {
  return (
    <div className="bg-neutral-800 px-5 py-5 rounded-xl w-full">
      <div className="flex justify-end ">
        <Link href={`/editnote?noteid=${noteItem._id}`}>
          <Pencil className="cursor-pointer" />
        </Link>
      </div>
      <h1 className="font-bold text-lg text-center">{noteItem.title}</h1>
      <p className="text-md text-center mt-3">{noteItem.content}</p>
    </div>
  );
};

export default NoteCard;
