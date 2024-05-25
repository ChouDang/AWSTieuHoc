import { StorageImage } from '@aws-amplify/ui-react-storage';
import { list, uploadData } from 'aws-amplify/storage';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hook';

const UserInfo = () => {

  const UserInfo = useAppSelector(state => state.user.UserInfo)
  const [file, setFile] = useState<File>();
  const [test, set_test] = useState<any>([])
  
  const handleChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await list({
          path: ({ identityId }) => {
            return `profile-pictures/${identityId}/`
          }
        });
        console.log(result, "result")
        set_test(result.items)
      } catch (error) {
        console.log(error);
      }
    })()
  }, [])

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button
        onClick={() =>
          uploadData({
            path: `profile-pictures/${UserInfo?.identityId}/${file?.name}`,
            data: file as File,
          })
        }
      >
        Upload
      </button>
      {test?.length && <StorageImage alt="cat" path={test?.[0]?.path || ""} />}
    </div>
  );
}

export default UserInfo