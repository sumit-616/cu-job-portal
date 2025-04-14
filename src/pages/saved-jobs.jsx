import { getSavedJobs, saveJob } from "@/api/apiJobs";
import { useState } from "react";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  const [savedJobIds, setSavedJobIds] = useState([]);

  useEffect(() => {
    if (savedJobs?.length) {
      setSavedJobIds(savedJobs.map(job => job.job_id)); 
    }
  }, [savedJobs]);

  const handleJobAction = async (jobId) => {
  setSavedJobIds((prevSavedJobIds) => {
    const alreadySaved = prevSavedJobIds.includes(jobId);

    const saveData = { job_id: jobId };

    saveJob({ alreadySaved, saveData });

    if (alreadySaved) {
      return prevSavedJobIds.filter(id => id !== jobId);
    } else {
      return [...prevSavedJobIds, jobId];
    }
  });

  fnSavedJobs();
};


  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={() => handleJobAction(saved.job_id)}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div>No Saved Jobs 👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
