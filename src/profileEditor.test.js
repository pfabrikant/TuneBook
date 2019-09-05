//Tests for the profile editor components

import React from "react";
import { BioEditor } from "./profileEditor";
import {
    render,
    fireEvent,
    waitForElement,
    wait
} from "@testing-library/react";
import instance from "../lib/axios";
//mocking axios
jest.mock("../lib/axios");
//mocking the updateProfile function that was passed as props to the component
const mockUpdateProfile = jest.fn(() => console.log("mockUpdateProfile runs"));

test("When no bio exists, an 'add bio' button is being rendered", () => {
    const { container } = render(<BioEditor bio={null} />);
    expect(container.innerHTML).toContain("Add a Bio");
});

test("When a bio is passed, an 'edit bio' button is rendered", () => {
    const { container } = render(<BioEditor bio={"I'm hungry"} />);
    expect(container.innerHTML).toContain("Edit Your Bio");
});

test("When the 'edit' or 'add' button are clicked, a textarea and save button appear", () => {
    const { container } = render(<BioEditor bio={"I'm hungry"} />);
    fireEvent.click(container.querySelector("button"));
    expect(container.innerHTML).toContain("<textarea>");
    expect(container.innerHTML).toContain("<button>Submit</button>");
});

test("When the submit button is clicked, an axios request is being made", async () => {
    const { container } = render(<BioEditor bio={"I'm hungry"} />);
    //edit bio button click
    fireEvent.click(container.querySelector("button"));
    //mocking the value of the axios request
    instance.post.mockResolvedValue({ data: { success: true } });
    //submit button click
    fireEvent.click(container.querySelector("button"));
    //waiting for the axios request to be resolved
    const element = await waitForElement(() => container.querySelector("div"));
    //expecting it to be resolved with an error message
    expect(element.innerHTML).toContain(
        "<p> Unfortunately something went wrong! Please try again!</p>"
    );
});

test("When the axios request is successful, the function that was passed as a prop to the component gets called", async () => {
    const { container } = render(
        <BioEditor bio={"I'm hungry"} updateProfile={mockUpdateProfile} />
    );
    //edit bio button click
    fireEvent.click(container.querySelector("button"));
    //mocking results of axios request
    instance.post.mockResolvedValue({ data: { success: true } });
    //submit button click
    fireEvent.click(container.querySelector("button"));
    //waiting one tick for axios promise to be resolved
    await wait();
    //expecting the mock props function to be called once
    expect(mockUpdateProfile.mock.calls.length).toBe(1);
});
