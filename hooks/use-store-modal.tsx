import { create } from "zustand";

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

//Creating a store
export const useStoreModal = create<useStoreModalStore>((set) => ({
    isOpen:false,
    onOpen:()=> set(({isOpen:true})),
    onClose:() => set(({isOpen:false}))
}));

/*
This is ZUSTAND:
A global state management library like redux where a single state is stored in a zustand store and then can be in used in components all over the app using user-defined hooks and providing a contextprovider to the app just like useContext 

1.I have stored the hooks in hooks folder
2.the context providers are there in the providers folder
3.the usage can be seen throughout the app
4. FIND THE DIFFERENCE BETWEEN USECONTEXT AND ZUSTAND

*/