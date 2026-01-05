// import { showToast } from "@/lib/showToast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

// const useDeleteMutation = (queryKey, deleteEndpoint) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ ids, deleteType }) => {
//       console.log("Deleting:", { ids, deleteType, deleteEndpoint }); // Debug log
//       const { data: response } = await axios({
//         url: deleteEndpoint,
//         method: deleteType === "PD" ? "DELETE" : "PUT",
//         data: { ids, deleteType },
//       });
//       if (!response.success) {
//         throw new Error(response.message);
//       }
//       console.log("Delete response:", response); // Debug log
//       return response;
//     },
//     onSuccess: (data) => {
//       console.log("Delete successful:", data); // Debug log
//       queryClient.invalidateQueries({ queryKey: [queryKey] });
//       showToast("success", data.message || "Operation completed successfully");
//     },
//     onError: (error) => {
//       console.error("Delete error:", error); // Debug log
//       showToast("error", error.response?.data?.message || "Operation failed");
//     },
//   });
// };

// export default useDeleteMutation;



// hooks/useDeleteMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const useDeleteMutation = (queryKey, deleteEndpoint) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      console.log('Making request:', { ids, deleteType, deleteEndpoint })
      
      let response;
      
      // Use PUT for Soft Delete and Restore
      if (deleteType === 'SD' || deleteType === 'RSD') {
        response = await axios.put(deleteEndpoint, { ids, deleteType })
      } 
      // Use DELETE for Permanent Delete
      else if (deleteType === 'PD') {
        response = await axios.delete(deleteEndpoint, { 
          data: { ids, deleteType } 
        })
      }
      
      console.log('API Response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Mutation successful:', data)
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      showToast('success', data.message || 'Operation completed successfully')
    },
    onError: (error) => {
      console.error('Mutation error:', error)
      showToast('error', error.response?.data?.message || 'Operation failed')
    }
  })
}

export default useDeleteMutation