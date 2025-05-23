export const RadioButton = ({ tags }) => {
  return (
    <div className="flex flex-row gap-2 mt-2">
      {tags.map((tag) => (
        <div key={tag.id} className="flex items-center gap-1">
          <input
            type="radio"
            name="tagId"
            className="radio radio-xs radio-accent"
            id={`tag-${tag.id}`}
            value={tag.id}
            required
          />
          <label className="label-text text-sm font-semibold" htmlFor={`tag-${tag.id}`}>
            {tag.name}
          </label>
        </div>
      ))}
    </div>
  );
};
