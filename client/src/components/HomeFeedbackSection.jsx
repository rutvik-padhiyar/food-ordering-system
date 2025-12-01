import React from "react";
import FeedbackForm from "./FeedbackForm";

const HomeFeedbackSection = ({ onSubmitSuccess }) => {
  return (
    <div>
      <FeedbackForm onSubmitSuccess={onSubmitSuccess} />
    </div>
  );
};

export default HomeFeedbackSection;
