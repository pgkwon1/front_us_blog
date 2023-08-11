import { IRootState } from "@/dto/ReduxDto";
import { Autocomplete, Chip, ChipDelete } from "@mui/joy";
import { Box, Stack, Typography } from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import frontApi from "@/modules/apiInstance";
import { useMutation, useQuery } from "react-query";
import { ISkillsProp, ISkillsAttr } from "@/dto/profile/SkillsDto";
import apiClient from "@/modules/reactQueryInstance";
export default function Skills({ skills }: ISkillsProp) {
  const userId = useSelector((state: IRootState) => state.userReducer.userId);
  const { profileId, profileOwner } = useSelector(
    (state: IRootState) => state.profileReducer
  );
  const [skillList, setSkillList] = useState<ISkillsAttr[]>([]);

  const getAllSkillList = async () => {
    const result = await frontApi.get(`/skills`);
    return result.data;
  };

  const handleChange = async (
    event: SyntheticEvent,
    newValue: ISkillsAttr
  ): Promise<void> => {
    if (newValue === null) return;
    const { id, label, category } = newValue;

    skillList.find((skill) => skill.name === label)
      ? ""
      : await addMutation.mutate({
          id,
          name: label as string,
          category,
        });
  };
  const addSkills = async ({ id, name }: ISkillsAttr) => {
    const result = await frontApi.post(`/skills/add`, {
      id,
      profileId,
      name,
    });
    return result.data;
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutate(id);
  };
  const deleteSkills = async (id: string) => {
    await frontApi.delete("/skills/delete", {
      data: {
        id,
      },
    });
  };

  const { data, isLoading } = useQuery<ISkillsAttr[]>(
    "getAllSkillList",
    getAllSkillList,
    {
      enabled: false,
    }
  );

  const addMutation = useMutation("addSkills", addSkills, {
    onSuccess: (data, variables) => {
      setSkillList((current) => {
        return [
          ...current,
          {
            id: data,
            name: variables.name,
            category: variables.category,
          },
        ];
      });
    },
  });

  const deleteMutation = useMutation("deleteSkills", deleteSkills, {
    onSuccess: (data, variables) => {
      setSkillList((current) =>
        current.filter((data) => data.id !== variables)
      );
    },
  });

  useEffect(() => {
    apiClient.prefetchQuery("getAllSkillsList", getAllSkillList, {
      staleTime: Infinity,
      cacheTime: Infinity,
    });
  }, []);

  useEffect(() => {
    if (skills?.length > 0) {
      setSkillList(
        skills?.map((skill: ISkillsAttr) => {
          return {
            id: skill.id,
            name: skill.name,
            category: skill.category,
          };
        })
      );
    }
  }, [skills]);
  const getColorByCategory = useMemo(() => {
    return (category: string) => {
      switch (category) {
        case "programming language":
        case "scripting":
        case "framework":
        case "library":
        case "database":
        case "vcs":
        case "testing":
        case "cms":
        case "paradigm":
        case "architecture":
          return "primary";

        case "technology":
        case "cloud computing":
        case "machine learning":
        case "big data":
        case "file sharing":
        case "containerization":
        case "messaging system":
        case "api":
        case "operating system":
        case "scripting":
        case "search engine":
        case "technology":
        case "continuous integration":
        case "authentication":
        case "security":
          return "warning";

        case "communication":
        case "project management":
        case "productivity":
        case "collaboration":
        case "methodology":
        case "testing":
          return "success";
        case "design":
        case "marketing":
        case "analytics":
        case "search engine":
        case "advertising":
          return "info";
        default:
          return "neutral";
      }
    };
  }, []);

  return (
    <Box>
      <Typography variant="h5">Skills</Typography>

      <Stack
        flexWrap="wrap"
        sx={{ gap: 1, overflow: "auto" }}
        direction={{ xs: "row", sm: "row" }}
      >
        {skillList.map((skill: ISkillsAttr, index) => {
          return (
            <Chip
              key={index}
              color={getColorByCategory(skill.category)}
              size={"lg"}
              variant="outlined"
              endDecorator={
                profileOwner ? (
                  <ChipDelete
                    onClick={() => {
                      handleDelete(skill.id);
                    }}
                  />
                ) : null
              }
            >
              <Typography component="span">{skill.name}</Typography>
            </Chip>
          );
        })}
      </Stack>
      <Box>
        {profileOwner ? (
          <Autocomplete
            size="lg"
            freeSolo
            placeholder="기술을 선택해주세요."
            onChange={handleChange}
            options={(data || []).map((skillInfo: ISkillsAttr) => {
              const { id, name, category } = skillInfo;
              return {
                id,
                label: name,
                category,
              };
            })}
            sx={{
              marginTop: "1rem",
              width: "50%",
            }}
          ></Autocomplete>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
}
