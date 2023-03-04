# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

###Task 1
Create a new table for the AgentCustomIds externalId of the agents by facility (there's a chance that the very same agent works in more than one facility
and they use different custom ids for each of them). This is actually easier, probably, than changing the schema of the existing Agents table.
The table should contain 3 columns,
- our internal agentId (foreign key)
- the external customId used by the Facility
- the facilityId of the Facility that uses it (foreign key)

**Effort**: 5 scrum points if we need approval from some authority in the company that owns the database. 2 scrum points otherwise.


###Task 2
Change the query in getShiftsByFacility to join not only the Agent table to the Shifts table to extract agent information but also the AgentCustomIds table
to extract the customId used by the facility where the shift happened and include it as an extra field in the PDF generated.

**Acceptance**: The tests should cover the case where the customId is missing (the code should not throw an error in that case, just not include the customId in the output)

**Effort**: 2 scrum points, this should be just changing the query to add the join (one line of code?) and adding an extra field to the PDF if it's present (another line of code), plus tests


###Task 3
Gather information from some product guy in the company, or directly from the Facilities about how they plan to give us the customIds they use for the Agents.
Will they prefer a RESTful API? Some tool to import CSV files exported from their database? Or some UI to enter these IDs manually one by one?

**Acceptance**: Three things to keep in mind / clarify

- Probably we need to figure out what's the most comfortable solution *for the Facility / Facilities that requested this feature to begin with*. I assume not all of them actually care about this much. Focus on the ones that will really use it extensively, and
- Convey to the product person the complexity of the options below. We should push for the simplest one as much as it's feasible.
- Find out if it would be possible for the Facilities to provide us with some unambiguous ID for the Agents other than their custom ID 
  (e.g., SSN / national ID card number)

**Effort**: time-box this to 2 hours. We cannot get dragged into an endless discussion here, this should be for the product person to figure out first.
If we go beyond the 2-hours, just leave it there and we skip the rest until there's clarity.

###Task 4 (uncertain)
Create a RESTful endpoint for Facilities to input the customId for each Agent that works with them. Payload is JSON, possibly with

- firstName
- lastName
- middleName (optional)
- SSN / nationalID?
- customId
  (FacilityId should be in the auth token)

The question here is what to do in the case where there's more than one person with the same data. If using SSN is possible for every agent, that would make 
our life so much easier.

**Acceptance**: 
- Testing should make sure this is SECURED. 401 / 403 should be returned for unauthenticated / unauthorized requests
- the controller should reject multiple POST requests for the same agent / facility pair with 409
- the controller should reject POST requests for a full name that matches more than one agent in the database if SSN / NationalID is missing with 422 and some descriptive message
- usual tests for 400s if required fields are missing (customId, firstName / lastName, I guess)
- accept SSN with or without dashes?
- we may want to prevent thrasing of the servers by returning 429 if some client requests too many in a row

**Effort**: 8 scrum points.

###Task 5 (uncertain)
UI for the Facilities to input the information manually. This would need task 4 to be completed first. It should be possible for them to look up Agents by full name (or maybe SSN number?), and once they
find the person in our system, input their customId for the person in question.

**Acceptance**:
- Testing should make sure this is SECURED. 401 / 403 should be returned for unauthenticated / unauthorized requests. Otherwise we'll be exposing all of our Agents names to the public. This is critical.
- No PII should be exposed either, make sure the fields to be returned are whitelisted rather than filtered out. We don't want new fields to be returned in the future by accident as they're added.
- Probably just the full name of the person should be enough, and / or the SSN / national ID, but we'd need to discuss this with the stakeholders first

**Effort**: 13 scrum points, especially if we need to involve the designers in this.


###Task 6 (uncertain)
Create an import script to read CSV files containing the full name of the agents and their customIds and import them into the database. Same info as in the 
JSON payload for the endpoint in task 4, but in columns.

**Acceptance**:
- There should be tests for cases where there are duplicates in the file (should error)
- The import tool should work with files that don't have SSN / National ID, perhaps, and work fine if there's only one person in the db with that full name
- Accept SSN with or without dashes

**Effort**: 8 scrum points (the validation of the file is what worries me the most)


